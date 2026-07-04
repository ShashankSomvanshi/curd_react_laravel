<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    //This method will return all active projects
    public function index(){
        $projects = Project::where('status',1)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status'=>true,
            'data'=>$projects
        ]);
    }

    //This method will return latest projects
    public function latestprojects(Request $request){
        $projects = Project::where('status',1)
                    ->take($request->get('limit'))
                    ->orderBy('created_at','DESC')->get();

        return response()->json([
            'status'=>true,
            'data'=> $projects
        ]);
    }
}
